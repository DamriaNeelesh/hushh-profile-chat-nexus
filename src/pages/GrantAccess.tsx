
import GrantAccessForm from "@/components/permissions/GrantAccessForm";
import ActiveGrantsList from "@/components/permissions/ActiveGrantsList";

const GrantAccess = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Grant Access to Your Assistant</h1>
        <p className="text-muted-foreground">
          Control who can chat with your Assistant and what information they can access
        </p>
      </div>
      <GrantAccessForm />
      <ActiveGrantsList />
    </div>
  );
};

export default GrantAccess;
