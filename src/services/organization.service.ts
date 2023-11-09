import Organization, { IOrganization } from '../models/organization.schema';

export const getAllOrganizations = async (): Promise<IOrganization[]> => {
  try {
    const organizations: IOrganization[] = await Organization.find().populate('owner').exec();

    if (!organizations) {
      throw new Error('No organizations found');
    }

    return organizations;
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const createOrganization = async ({
  name,
  userId,
  description,
  logo,
}: {
  name: string;
  description: string | null;
  logo: string | null;
  userId: string;
}): Promise<IOrganization> => {
  try {
    const organization: IOrganization = new Organization({
      name,
      description,
      logo,
      owner: userId,
    });

    await organization.save();

    return organization;
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const getOrganization = async (id: string): Promise<IOrganization> => {
  try {
    const organization = await Organization.findById(id);

    if (!organization) {
      throw new Error('No organization found');
    }

    return organization;
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const getAllUserOrganizations = async (userId: string): Promise<IOrganization[]> => {
  try {
    const organizations = await Organization.find({ owner: userId });

    if (!organizations) {
      throw new Error('No organizations found');
    }

    return organizations;
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

