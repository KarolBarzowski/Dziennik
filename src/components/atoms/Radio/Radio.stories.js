import React from 'react';
import Radio from './Radio';

export default {
  title: 'Atoms/Radio',
};

export const Default = () => (
  <>
    <Radio name="radio" checked onChange={null}>
      Label one
    </Radio>
    <br />
    <Radio name="radio" onChange={null}>
      Label two
    </Radio>
    <br />
    <Radio name="radio" onChange={null}>
      Label three
    </Radio>
  </>
);
