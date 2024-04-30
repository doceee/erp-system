import { helpers } from 'vuelidate/lib/validators';

const passwordRestrictions = helpers.regex(
    'passwordRestrictions',
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/
);

export default passwordRestrictions;
