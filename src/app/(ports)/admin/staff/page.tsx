import StaffComponent from "@/app/components/StaffComponent";
import summaryAPI from "@/lib/summaryAPI";
import axios from "axios";

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
    const response = await axios.get<{ staff: StaffType[] }>(
      `${process.env.NEXT_PUBLIC_API_URL}/${summaryAPI.admin.staff.getallStaff.url}`,
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
    staff = response.data.staff;
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
