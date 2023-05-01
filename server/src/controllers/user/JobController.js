const responseHelper = require('../../helpers/ResponseHelper');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class JobController {

  async list(req, res) {
    try {
      const jobs = await prisma.job.findMany({
        include: {
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
          JobApplication: {
            where: {
              userId: 2 // TODO: get this from req
            }
          },
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

}

module.exports = new JobController();