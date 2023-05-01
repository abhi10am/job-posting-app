const responseHelper = require('../../helpers/ResponseHelper');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class JobCategoryController {

  async list (req, res) {
    try {
      const categories = await prisma.jobCategory.findMany();

      if (categories.length) {
        return responseHelper.success(res, 'Categories fetched successfully', categories);
      }

      return responseHelper.error(res, 'Categories not found', 404);
    }
    catch (err) {
      console.log(err.message);
      return responseHelper.error(res, 'Something went wrong', 500);
    }
  }

  async create (req, res) {
    try {
      const { name } = req.body;
      const create = await prisma.jobCategory.create({
        data: { name }
      });

      if (create) {
        return responseHelper.success(res, 'Category created successfully', create);
      }

      return responseHelper.error(res, 'Failed to create category', 500);
    }
    catch (err) {
      console.log(err.message);
      return responseHelper.error(res, 'Something went wrong', 500);
    }
  }

  async update (req, res) {
    try {
      const { name } = req.body;
      const id = parseInt(req.params.id);
      const update = await prisma.jobCategory.update({
        where: { id },
        data: { name }
      });

      if (update) {
        return responseHelper.success(res, 'Category updated successfully');
      }

      return responseHelper.error(res, 'Failed to update category', 500);
    }
    catch (err) {
      console.log(err.message);
      return responseHelper.error(res, 'Something went wrong', 500);
    }
  }

  async delete (req, res) {
    try {
      const id = parseInt(req.params.id);
      const destroy = await prisma.jobCategory.delete({
        where: { id }
      });

      if (destroy) {
        return responseHelper.success(res, 'Category deleted successfully');
      }

      return responseHelper.error(res, 'Failed to delete category', 500);
    }
    catch (err) {
      console.log(err.message);
      return responseHelper.error(res, 'Something went wrong', 500);
    }
  }

}

module.exports = new JobCategoryController();