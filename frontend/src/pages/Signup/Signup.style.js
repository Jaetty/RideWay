import styled from 'styled-components';

const SignupContentRow = styled.div`
  font-size: 16px;
  // input {
  //   font-size: 18px;
  //   display: block;
  //   width: 280px;
  //   height: 50px;
  //   margin: 12px auto;
  //   padding 0 20px;
  //   border: 1;
  //   border-radius: 4px;
  // }
  .message {
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: -1px;
    // position: absolute;
    bottom: -10px;
    left: 0;
    &.success {
      color: #8f8c8b;
    }
    &.error {
      color: #ff2727;
    }
  }
`;

export { SignupContentRow };
