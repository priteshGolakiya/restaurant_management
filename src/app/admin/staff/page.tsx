import StaffComponent from "@/app/components/StaffComponent";

interface StaffType {
  userid: number;
  full_name: string;
  user_name: string;
  email: string;
  role: string;
}

const StaffPage = async () => {
  let staff: StaffType[] = [];

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/staff`,
      {
        cache: "no-store",
      }
    );
    if (response.ok) {
      const data = await response.json();
      staff = data.staff;
    }
  } catch (error) {
    console.error("Error fetching staff data:", error);
  }

  return (
    <div>
      <StaffComponent initialStaffData={staff} />
    </div>
  );
};

export default StaffPage;
