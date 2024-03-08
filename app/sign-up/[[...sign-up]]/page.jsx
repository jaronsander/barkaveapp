import { SignUp } from "@clerk/nextjs";

const signUp = () => {
  return (
    <div>
      <SignUp 
      redirectUrl="/"/>
    </div>
  )
}

export default signUp
