import { FC } from 'react';

type Field = {
  name: string;
  value: string;
};

const UneditableField: FC<Field> = (props) => {
  const { name, value } = props;
  return (
    <p>
      {name}: {value}
    </p>
  );
};

export default UneditableField;
