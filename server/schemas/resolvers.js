const { User } = require('../models');
const { AuthenticationError } =  require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user) {
                const userData = await User.findOne({_id:context.user._id})
                // do not return __v or password
               .select('-__v -password')
               // return list of books user has saved
               .populate('savedBooks')
               return userData;
               }
               throw new AuthenticationError('You are not logged in.');
        },
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({email});

            if (!user) {
                throw new AuthenticationError("Can't find this user");
            }
            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw) {
                throw new AuthenticationError('Incorrect login credentials.');
            }
            const token = signToken(user);

            return { token, user };
        },
        saveBook: async (parent, {input}, context) => {
            if(context.user) {
                const updatedUser = await User.findOneAndUpdate(
                   { _id: user._id },
                   // addToSet = mongo operator that adds to exists collection/table/field
                   { $addToSet: { savedBooks: input } },
                   // return updated data in MongoDB
                   { new: true, runValidators: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError('You are not logged in.');
        },
        deleteBook: async (parent, args, context) => {
            if(context.user) {
                const updatedUser = await User.findOneAndUpdate(
                  { _id: user._id },
                  // pull removes data
                  { $pull: { savedBooks: { bookId: args.bookId } } },
                  // return updated data in MongoDB
                  { new: true }
                );
                return updatedUser;
               }
               throw new AuthenticationError('You are not logged in.');
        },
    }
};

module.exports = resolvers;