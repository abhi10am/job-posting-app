const responseHelper = require('../../helpers/ResponseHelper');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class JobController {

  async list(req, res) {
    try {
      const jobs = await prisma.job.findMany({ include: {
          category: true,
          type: true,
        } 
      });

      if (jobs.length) {
        return responseHelper.success(res, 'Jobs fetched successfully', jobs);
      }

      return responseHelper.error(res, 'Jobs not found', 404);
    }
    catch (err) {
      console.log(err.message);
      return responseHelper.error(res, 'Something went wrong', 500);
    }
  }

  async get(req, res) {
    try {
      const id = parseInt(req.params.id);
      const job = await prisma.job.findFirst({ 
        where: { id },
        include: {
          category: true,
          type: true,
        }
      });

      if (job) {
        return responseHelper.success(res, 'Job fetched successfully', job);
      }

      return responseHelper.error(res, 'Job not found', 404);
    }
    catch (err) {
      console.log(err.message);
      return responseHelper.error(res, 'Something went wrong', 500);
    }
  }

  async create(req, res) {
    try { 
      const { title, companyName, tags, skills, experience, description, salary, category, type, additionalDetails } = req.body;

      const create = await prisma.job.create({
        data: { 
          title,
          companyName,
          tags,
          skills,
          experience,
          description,
          salary,
          adminId: 1, // TODO: get from req
          categoryId: parseInt(category),
          typeId: parseInt(type),
          additionalDetails: JSON.stringify(additionalDetails),
        }
      });

      if (create) {
        return responseHelper.success(res, 'Job created successfully', create);
      }

      return responseHelper.error(res, 'Failed to create job', 500);
    }
    catch (err) {
      console.log(err.message);
      return responseHelper.error(res, 'Something went wrong', 500);
    }
  }

  async delete(req, res) {
    try {
      const id = parseInt(req.params.id);
      const destroy = await prisma.job.delete({
        where: { id }
      });

      if (destroy) {
        return responseHelper.success(res, 'Job deleted successfully');
      }

      return responseHelper.error(res, 'Failed to delete job', 500);
    }
    catch (err) {
      console.log(err.message);
      return responseHelper.error(res, 'Something went wrong', 500);
    }
  }

}

module.exports = new JobController();