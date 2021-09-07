import mongoose, { mongo } from "mongoose";
import  {IUser} from '../../Models/User';
// https://medium.com/@agentwhs/complete-guide-for-typescript-for-mongoose-for-node-js-8cc0a7e470c1

const userSchema = new mongoose.Schema({
    UserName: {
        type: String,
        require: true
    },
    FirstName: {
        type: String,
        require: true
    },
    LastName: {
        type: String,
        require: true
    },
    Password: {
        type: String,
        require: true
    },
    UserCreated: {
        type: Date,
        require: true
    },
    Likes:{
        type: [{
            _id : false,
            UserLikedId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            Like: {type: Boolean},
            Date: {type: Date}
        }]
    }
},{
    toJSON: { virtuals: true },
  });

// Virtuals
userSchema.virtual('FullName').get(function (this: any) {
    if(this.FirstName && this.LastName)
        return `${this.FirstName} ${this.LastName}`;
    else return
});

userSchema.pre('save', function(this: any, next ) {
    this.UserCreated = Date.now();
    next();
  });

export default mongoose.model<IUser>('User', userSchema);