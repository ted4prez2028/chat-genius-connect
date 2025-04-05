
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import VideoCall from './VideoCall';

const AICallButton = () => {
  const [isCallOpen, setIsCallOpen] = useState(false);

  const openVideoCall = () => {
    setIsCallOpen(true);
  };

  const closeVideoCall = () => {
    setIsCallOpen(false);
  };

  return (
    <>
      <Button
        onClick={openVideoCall}
        className="bg-purple-700 hover:bg-purple-800 gap-2"
      >
        <Video size={18} />
        <span>Video Call AI Assistant</span>
      </Button>
      
      <VideoCall
        isOpen={isCallOpen}
        onClose={closeVideoCall}
      />
    </>
  );
};

export default AICallButton;
