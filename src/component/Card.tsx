import { View } from 'react-native';
import React, { ReactComponentElement } from 'react';

function Card(children: ReactComponentElement) {
  return <View>{children}</View>;
}

export default Card;
