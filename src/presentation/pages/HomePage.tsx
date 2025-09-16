import BaseLayout from "../layouts/BaseLayout";

const HomePage = () => {
  const userInput = "<script>alert('xss')</script>Acme Corp";
  const userDescription =
    "<p>We build <strong>great</strong> software!</p><script>alert('bad')</script>";

  return (
    <BaseLayout
      headerTitle={userInput}
      companyName={userInput}
      footerDescription={userDescription}
      userDisplayName="John <script>alert('xss')</script> Doe"
    >
      <div className="max-w-7xl mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold text-gray-900">Welcome Home</h1>
      </div>
    </BaseLayout>
  );
};

export default HomePage;
