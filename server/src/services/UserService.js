const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class UserService {
  async findUserByEmail (email) {
    return await prisma.user.findFirst({
      where: { email }
    })
  }
}

module.exports = new UserService();