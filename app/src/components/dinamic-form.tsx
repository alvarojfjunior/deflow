import React from 'react';
import {
  materialRenderers,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';

export default function DinamicForm({ schema, onChange, value }: any) {
  return (
    <JsonForms
      schema={schema}
      data={value}
      renderers={materialRenderers}
      onChange={({ data }) => onChange(data)}
    />
  );
}