const { User, Book } = require('../models');
const { AuthenticationError } =  require('apollo-server-express');
const { signToken } = require('../utils/auth');
const { update } = require('../models/User')

const resolvers = {
    Query: {
        user: async (parent, { username }) => {
            return User.findOne({ username })
            .select('-__v -password')
            .populate('savedBooks')
        },
    },
    Mutation: {
        createUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError("Can't find this user");
            }
            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw) {
                throw new AuthenticationError('Incorrect login credentials!');
            }
            const token = signToken(user);

            return { token, user };
        },
        saveBook: async (parent, args, context) => {

        },
        removeBook: async (parent, args, context) => {

        },
    }
};

module.exports = resolvers;