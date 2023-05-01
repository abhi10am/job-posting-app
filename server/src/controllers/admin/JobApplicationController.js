const responseHelper = require('../../helpers/ResponseHelper');
const { PrismaClient } = require("@prisma/client");
const sendApplicationUpdateEmail = require('../../mail/SendApplicationUpdateEmail');
const prisma = new PrismaClient();

class JobApplicationController {

  async list(req, res) {
    try {
      const jobs = await prisma.jobApplication.findMany({
        include: { 
          user: true,
          job: true
        }
      });

      if (jobs.length) {
        return responseHelper.success(res, 'Job applications fetched successfully', jobs);
      }

      return responseHelper.error(res, 'Job applications not found', 404);
    }
    catch (err) {
      console.log(err.message);
      return responseHelper.error(res, 'Something went wrong', 500);
    }
  }

  async get(req, res) {
    try {
      const id = parseInt(req.params.id);
      const jobApplication = await prisma.jobApplication.findFirst({
        where: { id },
        include: { 
          user: true,
          job: true
        }
      });

      if (jobApplication) {
        return responseHelper.success(res, 'Job application fetched successfully', jobApplication);
      }

      return responseHelper.error(res, 'Job application not found', 404);
    }
    catch (err) {
      console.log(err.message);
      return responseHelper.error(res, 'Something went wrong', 500);
    }
  }

  async updateStatus(req, res) {
    try {
      const { status, rejectReason } = req.body;
      const id = parseInt(req.params.id);
      const update = await prisma.jobApplication.update({
        where: { id },
        data: { 
          status,
          rejectReason
        }
      });

      if (update) {
        // Send email to candidate
        const application = await prisma.jobApplication.findFirst({
          where: { id },
          include: {
            user: true,
            job: true,
          }
        });
        sendApplicationUpdateEmail(application);
        return responseHelper.success(res, 'Job application updated successfully', update);
      }

      return responseHelper.error(res, 'Failed to update job application', 500);
    }
    catch (err) {
      console.log(err.message);
      return responseHelper.error(res, 'Something went wrong', 500);
    }
  }

}

module.exports = new JobApplicationController();