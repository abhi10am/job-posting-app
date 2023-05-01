const responseHelper = require('../../helpers/ResponseHelper');
const { PrismaClient } = require("@prisma/client");
const sendApplicationUpdateEmail = require('../../mail/SendApplicationUpdateEmail');
const path = require('path');
const prisma = new PrismaClient();
const fs = require('fs');

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
 
  async downloadResume(req, res) {
    try {
      const id = parseInt(req.params.id);
      const application = await prisma.jobApplication.findFirst({
        where: { id }
      });

      if (!application) {
        return responseHelper.error(res, 'Application not found', 404);
      }

      if (!application.resume) {
        return responseHelper.error(res, 'Resume not found', 404);
      }

      const filePath = path.join(__dirname, '../../../', application.resume);
      const stats = fs.statSync(filePath);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Length', stats.size);
      res.setHeader('Content-Disposition', 'attachment; filename=Resume.pdf');
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
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