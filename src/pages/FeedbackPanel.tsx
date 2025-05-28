import FeedbackBoardDnD from "../components/feedback/FeedbackBoardDnD";

interface BoardDragOnlyProps {
  projectId: string;
}

const FeedbackPanel = ({ projectId }: BoardDragOnlyProps) => {
  return <FeedbackBoardDnD projectId={projectId} />;
};

export default FeedbackPanel;
