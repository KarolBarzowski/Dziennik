import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { Formik, Form, ErrorMessage } from 'formik';
import firebase from 'firebase/config';
import { Redirect } from 'react-router-dom';
import * as Yup from 'yup';
import Heading from 'components/atoms/Heading/Heading';
import Paragraph from 'components/atoms/Paragraph/Paragraph';
import Switch from 'components/atoms/Switch/Switch';
import { fadeIn } from 'functions/animations';

const StyledWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  width: 32rem;
  max-width: 32rem;
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-flow: column nowrap;
`;

const StyledLabel = styled.label`
  display: flex;
  flex-flow: column nowrap;
  margin: 0.4rem 0 1rem;

  ${({ isRegister }) =>
    isRegister &&
    css`
      animation: ${fadeIn} ${({ theme }) => theme.fadeTransition};
    `}
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 1rem 1rem;
  margin-top: 0.4rem;
  border: 0.2rem solid ${({ theme }) => theme.switch};
  border-radius: 0.5rem;
  font-family: 'Roboto';
  font-size: 1.6rem;
  outline: none;
  transition: border-color 0.15s ease-in-out;

  :focus {
    border: 0.2rem solid ${({ theme }) => theme.blue};
  }

  ${({ isError }) =>
    isError &&
    css`
      border: 0.2rem solid ${({ theme }) => theme.red};

      :focus {
        border: 0.2rem solid ${({ theme }) => theme.red};
      }
    `};

  @media screen and (min-width: 600px) {
    width: 28rem;
  }
`;

const StyledSubmit = styled.button`
  padding: 0.8rem 1.4rem;
  margin: 1rem 0;
  border: 0;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.blue};
  color: white;
  font-family: 'Montserrat';
  font-size: 1.6rem;
  cursor: pointer;

  :enabled:hover {
    background-color: ${({ theme }) => theme.blueHover};
  }

  :enabled:focus {
    background-color: ${({ theme }) => theme.blueFocus};
  }

  :disabled {
    opacity: 0.38;
    cursor: default;
  }
`;

const StyledParagraph = styled(Paragraph)`
  font-size: ${({ theme }) => theme.m};
`;

const StyledButton = styled.button`
  margin: 0.5rem 0;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.blue};
  font-family: 'Montserrat';
  font-size: ${({ theme }) => theme.m};
  cursor: pointer;

  :hover {
    text-decoration: underline;
  }

  ${({ appear }) =>
    appear
      ? css`
          transform: translateX(-1rem);
          opacity: 0;
          visibility: hidden;
          transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out, visibility 0s 0.3s;
        `
      : css`
          transform: translateX(0);
          opacity: 1;
          visibility: visible;
          transition: transform 0.15s ease-in-out, opacity 0.15s ease-in-out;
        `};
`;

const StyledError = styled(Paragraph)`
  color: ${({ theme }) => theme.red};
  margin-top: 0.2rem;
`;

const StyledSwitchWrapper = styled.label`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  margin-left: -0.5rem;
`;

const StyledSeparator = styled(Paragraph)`
  margin-left: 0.5rem;
`;

function LoginForm() {
  const [isRegister, setIsRegister] = useState(false);
  const [isRemember, setIsRemember] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        setIsUser(true);
      } else {
        // User is signed out.
      }
    });
  }, []);

  const getErrorMsg = err => {
    switch (err) {
      case 'auth/user-not-found':
        return 'Nie znaleziono konta';
      case 'auth/wrong-password':
        return 'Błędne hasło lub login';
      case 'auth/too-many-requests':
        return 'Za dużo nieudanych prób, spróbuj później';
      case 'auth/email-already-in-use':
        return 'Email jest zajęty';
      default:
        return 'Nieznany błąd';
    }
  };

  if (isUser) {
    return <Redirect to="/" />;
  }

  return (
    <StyledWrapper>
      <Heading>{isRegister ? 'Rejestracja' : 'Logowanie'}</Heading>
      <Formik
        initialValues={{ email: 'abc@abc.com', password: 'abc', confirmPassword: 'abc' }}
        validationSchema={
          isRegister
            ? Yup.object().shape({
                email: Yup.string()
                  .email('Email jest nieprawidłowy')
                  .required('Email jest wymagany'),
                password: Yup.string()
                  .min(6, 'Min. 6 znaków')
                  .required('Hasło jest wymagane'),
                confirmPassword: Yup.string()
                  .oneOf([Yup.ref('password'), null], 'Hasła nie są takie same')
                  .required('Potwierdzenie hasła jest wymagane'),
              })
            : Yup.object().shape({
                email: Yup.string()
                  .email('Email jest nieprawidłowy')
                  .required('Email jest wymagany'),
                password: Yup.string()
                  .min(6, 'Min. 6 znaków')
                  .required('Hasło jest wymagane'),
              })
        }
        onSubmit={({ email, password }, { setSubmitting }) => {
          setError('');
          if (isRegister) {
            firebase
              .auth()
              .createUserWithEmailAndPassword(email, password)
              .catch(({ code }) => {
                setError(getErrorMsg(code));
              });
          } else if (isRemember) {
            firebase
              .auth()
              .signInWithEmailAndPassword(email, password)
              .catch(({ code }) => {
                setError(getErrorMsg(code));
              });
          } else {
            firebase
              .auth()
              .setPersistence(firebase.auth.Auth.Persistence.SESSION)
              .then(() =>
                firebase
                  .auth()
                  .signInWithEmailAndPassword(email, password)
                  .catch(({ code }) => {
                    setError(getErrorMsg(code));
                  }),
              );
          }

          setTimeout(() => {
            setSubmitting(false);
          }, 1000);
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <StyledForm>
            <StyledLabel htmlFor="email">
              <StyledParagraph>Email</StyledParagraph>
              <StyledInput
                id="email"
                name="email"
                type="email"
                value={values.email}
                placeholder="Email"
                onChange={handleChange}
                onBlur={handleBlur}
                isError={errors.email && touched.email}
              />
              <ErrorMessage name="email" component={StyledError} />
            </StyledLabel>
            <StyledLabel htmlFor="password">
              <StyledParagraph>Hasło</StyledParagraph>
              <StyledInput
                id="password"
                name="password"
                type="password"
                value={values.password}
                placeholder="Hasło"
                onChange={handleChange}
                onBlur={handleBlur}
                isError={errors.password && touched.password}
              />
              <ErrorMessage name="password" component={StyledError} />
            </StyledLabel>
            {isRegister && (
              <StyledLabel htmlFor="confirmPassword" isRegister={isRegister}>
                <StyledParagraph>Potwierdź hasło</StyledParagraph>
                <StyledInput
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={values.confirmPassword}
                  placeholder="Hasło"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isError={errors.confirmPassword && touched.confirmPassword}
                />
                <ErrorMessage name="confirmPassword" component={StyledError} />
              </StyledLabel>
            )}
            {!isRegister && (
              <StyledSwitchWrapper>
                <Switch checked={isRemember} onChange={() => setIsRemember(!isRemember)} />
                <StyledSeparator>Logowanie automatyczne</StyledSeparator>
              </StyledSwitchWrapper>
            )}
            <StyledSubmit type="submit" disabled={isSubmitting}>
              {isRegister ? 'Zarejestruj się' : 'Zaloguj się'}
            </StyledSubmit>
            {error.length ? <StyledError>{error}</StyledError> : null}
          </StyledForm>
        )}
      </Formik>
      <StyledButton type="button" onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? 'Mam już konto' : 'Nie mam konta'}
      </StyledButton>
      <StyledButton type="button" appear={isRegister}>
        Zapomniałeś/aś hasła?
      </StyledButton>
    </StyledWrapper>
  );
}

export default LoginForm;
