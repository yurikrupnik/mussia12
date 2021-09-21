import { UserSchema, UserDocument } from '@mussia12/shared/mongoose-schemas';
import mongoose from 'mongoose';

export default mongoose.model('users', UserSchema);

export { UserDocument };
