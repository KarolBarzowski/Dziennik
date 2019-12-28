import React from 'react';
import Radio from './Radio';

export default {
  title: 'Atoms/Radio',
};

export const Default = () => (
  <>
    <Radio name="radio" checked onChange={() => console.log('1')}>
      Label one
    </Radio>
    <br />
    <Radio name="radio" onChange={() => console.log('2')}>
      Label two
    </Radio>
    <br />
    <Radio name="radio" onChange={() => console.log('3')}>
      Label three
    </Radio>
  </>
);
