"use client"

import MemberRegistrationForm, {
  type FellowshipOption,
} from "./member-registration-form"

export const CreateMemberPage = ({
  fellowships,
}: {
  fellowships?: FellowshipOption[]
}) => {
  return <MemberRegistrationForm initialFellowships={fellowships} />
}

export default CreateMemberPage
