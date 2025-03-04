// External Dependencies
import { useQuery } from "@tanstack/react-query";
// import { useSession} from 'better-auth'

// Internal Dependencies
import { authClient } from "@/lib/auth-client";

const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await authClient.getSession();
      const session = await authClient.listSessions();
      console.log("session", session);
      console.log("in hook is", data);
      return { user: data?.user, session: data?.session };
    },
  });
};

export default useUser;
