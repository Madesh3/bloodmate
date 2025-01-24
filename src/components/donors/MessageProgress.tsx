interface MessageProgressProps {
  progress: number;
  selectedCount: number;
}

const MessageProgress = ({ progress, selectedCount }: MessageProgressProps) => {
  return (
    <div className="flex flex-col">
      <span>{selectedCount} donors selected</span>
      {progress > 0 && <span className="text-sm text-gray-500">Progress: {progress}%</span>}
    </div>
  );
};

export default MessageProgress;