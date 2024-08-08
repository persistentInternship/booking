import { Schema, model, models } from 'mongoose';

const StyleSchema = new Schema({
  backgroundColor: String,
  textColor: String,
  buttonColor: String,
  logoColor: String,
  hoverColor: String,
});

const Style = models.Style || model('Style', StyleSchema);

export default Style;