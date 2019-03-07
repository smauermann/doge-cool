import utils from '../lib/utils';
import { Context } from '../types/bottender';

exports.tip = async (context: Context, block_io: any) => {
  let [, , toLabel, amount] = context.event.text.split(' ');
  const myLabel = context.session.user.id;
  toLabel = toLabel.replace(/[<>@]/g, '');

  if (Number(amount) < 2) {
    return context.sendText(
      `Come on, don't be stingy! I can't even pay the network rent with that!. ${utils.generateWow()}`
    );
  }

  block_io.withdraw_from_labels(
    {
      from_labels: myLabel,
      to_label: toLabel,
      amount: amount,
      pin: process.env.BLOCK_IO_SECRET_PIN,
    },
    async (error: any, data: any) => {
      if (error) {
        let errorToThrow = error;

        if (
          error.message.includes(
            'One or more destination labels do not exist on your account'
          )
        ) {
          errorToThrow = `I didn't find the user... :(`;
        }
        return context.sendText(`Oh no!!! ${errorToThrow}`);
      }

      await context.sendText(
        `${utils.generateCongrats()} <@${toLabel}> you just received ${amount} doge. ${utils.generateWow()}`
      );
    }
  );
};