
export const aiPhrases = [
  "Hi there! I'm Olivia, your Food Truck Community specialist. I can help you discover amazing food trucks for your events or assist you with our dashboard features.",
  "Our platform connects you with over 50 unique food trucks across multiple cuisines. Would you like me to walk you through our booking process?",
  "I see you're on the brands page! This is where you can manage your brand identity and customize how your food truck events look to customers.",
  "The dashboard provides real-time analytics on your food truck events. The summary cards at the top show your key metrics at a glance.",
  "Did you know our platform offers instant chat support with food truck vendors? It's perfect for discussing menu customizations or special requirements.",
  "The tags section on your dashboard helps categorize your events by cuisine type, event size, or budget range. It makes filtering and reporting much easier.",
  "Our Daily Sales Chart shows your booking trends over time. It's helpful for identifying peak seasons and planning your marketing efforts.",
  "The Package Sales table shows which of our booking packages are most popular. Premium packages include extra services like setup assistance and marketing support.",
  "Our payment processing is secure and supports multiple payment methods including credit cards, digital wallets, and even split payments for group events.",
  "I'd be happy to explain any aspect of our platform in more detail. Just let me know what you're interested in learning more about!"
];

export const getInitialGreeting = () => {
  return "Hi there! I'm Olivia, your Food Truck Community specialist. How can I assist you today?";
};

export const getMuteResponse = (isMuted: boolean) => {
  return isMuted 
    ? "Great, I can hear you again! Were you interested in learning about how to customize your brand profile or did you have questions about other aspects of our platform?"
    : "I see you've muted your microphone. No problem! While we're on pause, I can mention that our brands section lets you customize your vendor profile with logos, color schemes, and marketing materials. Just let me know when you're ready to chat again!";
};

export const getVideoResponse = (isVideoOff: boolean) => {
  return isVideoOff
    ? "There you are! Welcome back. In the brands section, you can create multiple brand profiles if you manage different food truck concepts or events."
    : "I see you've turned your camera off. That's fine! Did you know you can upload custom brand assets in the brands section? You can add logos, banners, and even promotional images for your food truck business.";
};

export const getVoiceDetectionResponse = () => {
  return "I can hear you! Feel free to ask me about managing your food truck brands, customizing your vendor profile, or any other feature on our platform.";
};

export const getConnectedResponse = () => {
  return "Great! I can see and hear you now. How can I assist you with our food truck platform today?";
};
