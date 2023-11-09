import { NextFunction, Request, Response } from 'express';

import internalServerError from '../errors/internal-server.error';
import notFoundError from '../errors/not-found.error';
import unauthorizedError from '../errors/unauthorized.error';
import validationError from '../errors/validation.error';
import { organizationSchema } from '../schema/organization.schema';
import {
  getAllOrganizations as getAllOrganizationsService,
  getAllUserOrganizations as getAllUserOrganizationsService,
  createOrganization as createOrganizationService,
  getOrganization as getOrganizationService,
} from '../services/organization.service';

export const getAllOrganizations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const organizations = await getAllOrganizationsService();

    if (!organizations) {
      next(notFoundError('No organizations found'));
    }

    const formattedOrganizations = organizations.map(organization => ({
      id: organization._id,
      name: organization.name,
      description: organization.description,
      logo: organization.logo,
      owner: organization.owner,
    }));

    res.status(200).json({
      message: 'Successfully retrieved organizations',
      data: {
        organizations: formattedOrganizations,
      },
      error: null,
    });
  } catch (error: any) {
    next(internalServerError(error.message ?? 'Sorry, an error occured', error));
  }
};

export const getAllUserOrganizations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.user._id;

    if (!userId) {
      next(unauthorizedError('Unauthorized'));
    }

    const organizations = await getAllUserOrganizationsService(userId);

    if (!organizations) {
      next(notFoundError('No organizations found'));
    }

    const formattedOrganizations = organizations.map(organization => ({
      id: organization._id,
      name: organization.name,
      description: organization.description,
      logo: organization.logo,
      owner: organization.owner,
    }));

    res.status(200).json({
      message: 'Successfully retrieved organizations',
      data: {
        organizations: formattedOrganizations,
      },
      error: null,
    });
  } catch (error: any) {
    next(internalServerError(error.message ?? 'Sorry, an error occured', error));
  }
};

export const createOrganization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, logo } = organizationSchema.parse(req.body);
    try {
      const userId = res.locals.user._id;

      if (!userId) {
        next(unauthorizedError('Unauthorized'));
      }

      const organization = await createOrganizationService({
        name,
        description: description ?? null,
        logo: logo ?? null,
        userId,
      });

      res.status(201).json({
        message: 'Successfully created organization',
        data: {
          organization,
        },
        error: null,
      });
    } catch (error: any) {
      next(internalServerError(error.message ?? 'Sorry, an error occured', error));
    }
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      next(validationError(error));
    }
  }
};

export const getOrganization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      next(notFoundError('No organization found'));
    }

    const organization = getOrganizationService(id);

    if (!organization) {
      next(notFoundError('No organization found'));
    }

    res.status(200).json({
      message: 'Successfully retrieved organization',
      data: {
        organization,
      },
      error: null,
    });
  } catch (error: any) {
    next(internalServerError(error.message ?? 'Sorry, an error occured', error));
  }
};

