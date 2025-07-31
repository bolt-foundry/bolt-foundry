export default 'mutation JoinWaitlist ($name: String!, $email: String!, $company: String!) {\
  joinWaitlist____name___v_name____email___v_email____company___v_company: joinWaitlist(name: $name, email: $email, company: $company) {\
    message,\
    success,\
  },\
}';