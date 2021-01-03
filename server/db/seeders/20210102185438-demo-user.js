"use strict";
const faker = require("faker");
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert(
      "Users",
      [
        {
          email: "demo@user.io",
          username: "Demo-lition",
          hashedPassword: bcrypt.hashSync("password"),
          lastUsed: faker.date.recent(),
        },
        {
          email: faker.internet.email(),
          username: "FakeUser1",
          hashedPassword: bcrypt.hashSync(faker.internet.password()),
          lastUsed: faker.date.recent(),
        },
        {
          email: faker.internet.email(),
          username: "FakeUser2",
          hashedPassword: bcrypt.hashSync(faker.internet.password()),
          lastUsed: faker.date.recent(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return await queryInterface.bulkDelete(
      "Users",
      {
        username: { [Op.in]: ["Demo-lition", "FakeUser1", "FakeUser2"] },
      },
      {}
    );
  },
};