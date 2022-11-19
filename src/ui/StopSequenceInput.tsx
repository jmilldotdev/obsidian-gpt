import { TagsInput } from "react-tag-input-component";
import * as React from "react";

const StopSequenceInput = ({
  stopSequences,
  onChange,
}: {
  stopSequences: string[];
  onChange: (stopSequences: string[]) => void;
}) => {
  return (
    <>
      <label htmlFor="stopSequence">Stop Sequences:</label>
      <TagsInput value={stopSequences} onChange={onChange} />
    </>
  );
};

export default StopSequenceInput;
