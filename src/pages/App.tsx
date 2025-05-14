import FeedbackWidget from "../components/FeedbackWidget";
import DashboardLayout from "../components/DashboardLayout";
import FeedbackPanel from "../pages/FeedbackPanel";

const App = () => {
  return (
    <>
      <FeedbackWidget />
      <DashboardLayout>
        <FeedbackPanel />
      </DashboardLayout>
    </>
  );
};

export default App;
