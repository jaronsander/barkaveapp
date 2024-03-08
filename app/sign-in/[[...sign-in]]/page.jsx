
import { SignIn } from "@clerk/nextjs";

const signIn = () => {
  return (
    <div>
      <SignIn 
      redirectUrl="/"
      />
    </div>
  )
}

export default signIn
