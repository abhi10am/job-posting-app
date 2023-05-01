const responseHelper = require('../../helpers/ResponseHelper');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class JobTypeController {

  async list(req, res) {
    try {
      const types = await prisma.jobType.findMany();

      if (types.length) {
        return responseHelper.success(res, 'Job types fetched successfully', types);
      }

      return responseHelper.error(res, 'Job types not found', 404);
    }
    catch (err) {
      console.log(err.message);
      return responseHelper.error(res, 'Something went wrong', 500);
    }
  }

  async create(req, res) {
    try {
      const { name } = req.body;
      const create = await prisma.jobType.create({
        data: { name }
      });

      if (create) {
        return responseHelper.success(res, 'Job type created successfully', create);
      }

      return responseHelper.error(res, 'Failed to create job type', 500);
    }
    catch (err) {
      console.log(err.message);
      return responseHelper.error(res, 'Something went wrong', 500);
    }
  }

  async update(req, res) {
    try {
      const { name } = req.body;
      const id = parseInt(req.params.id);
      const update = await prisma.jobType.update({
        where: { id },
        data: { name }
      });

      if (update) {
        return responseHelper.success(res, 'Job type updated successfully');
      }

      return responseHelper.error(res, 'Failed to update job type', 500);
    }
    catch (err) {
      console.log(err.message);
      return responseHelper.error(res, 'Something went wrong', 500);
    }
  }

  async delete(req, res) {
    try {
      const id = parseInt(req.params.id);
      const destroy = await prisma.jobType.delete({
        where: { id }
      });

      if (destroy) {
        return responseHelper.success(res, 'Job type deleted successfully');
      }

      return responseHelper.error(res, 'Failed to delete job type', 500);
    }
    catch (err) {
      console.log(err.message);
      return responseHelper.error(res, 'Something went wrong', 500);
    }
  }

}

module.exports = new JobTypeController();