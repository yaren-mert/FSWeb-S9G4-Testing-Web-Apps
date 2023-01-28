import React, { useReducer } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";
import App from "../App";

test("hata olmadan render ediliyor", () => {
  render(<App />);
});

test("iletişim formu headerı render ediliyor", () => {
  render(<IletisimFormu />);
  const thingToTest = screen.getByText(/İletişim Formu/i);
  expect(thingToTest).toBeInTheDocument();
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  render(<IletisimFormu />);
  const kullaniciAdi = screen.getByPlaceholderText(/İlhan/i);
  userEvent.type(kullaniciAdi, "Gob");
  const hataIsim = screen.getByTestId("error");
  expect(hataIsim).toBeInTheDocument();
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const EmailkullaniciAdi = screen.getByPlaceholderText(/İlhan/i);
  const kullaniciSoyadi = screen.getByPlaceholderText(/Mansız/i);
  const Email = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i);
  userEvent.type(EmailkullaniciAdi, "a");
  userEvent.type(kullaniciSoyadi, "a");
  userEvent.clear(kullaniciSoyadi);
  userEvent.type(Email, "d");
  const hataListesi = await screen.getAllByTestId("error");
  expect(hataListesi.length).toEqual(3);
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const EmailkullaniciAdi = screen.getByPlaceholderText(/İlhan/i);
  const kullaniciSoyadi = screen.getByPlaceholderText(/Mansız/i);
  const submitBtn = screen.getAllByRole("button");
  userEvent.type(EmailkullaniciAdi, "Yaren");
  userEvent.type(kullaniciSoyadi, "M.");
  userEvent.click(submitBtn[0]);
  const hataListesi = await screen.getAllByTestId("error");
  expect(hataListesi.length).toEqual(1);
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const Email = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i);
  userEvent.type(Email, "y");
  const hataListesi = await screen.getByTestId("error");
  expect(hataListesi).toHaveTextContent(
    "email geçerli bir email adresi olmalıdır."
  );
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const soyad = screen.getByPlaceholderText(/Mansız/i);

  userEvent.type(soyad, "z");
  userEvent.clear(soyad);

  const hataListesi = await screen.getByTestId("error");
  expect(hataListesi).toHaveTextContent("soyad gereklidir.");
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  render(<IletisimFormu />);
  const kullaniciAdi = screen.getByPlaceholderText(/İlhan/);
  const kullaniciSoyadi = screen.getByPlaceholderText(/Mansız/);
  const Email = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/);
  userEvent.type(kullaniciAdi, "Yaren");
  userEvent.type(kullaniciSoyadi, "Mert");
  userEvent.type(Email, "yarenmert@gmail.com");
  const submitButton = screen.getByText(/Gönder/);
  userEvent.click(submitButton);
  await waitFor(() => {
    const errorDiv = screen.queryAllByTestId("error");
    expect(errorDiv.length).toBe(0);
  });
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  render(<IletisimFormu />);
  const nameInput = screen.getByPlaceholderText(/İlhan/);
  const surnameInput = screen.getByPlaceholderText(/Mansız/);
  const emailInput = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/);
  userEvent.type(nameInput, "Yaren");
  userEvent.type(surnameInput, "Mert");
  userEvent.type(emailInput, "yarenmert@gmail.com");
  const submitButton = screen.getByText(/Gönder/);
  userEvent.click(submitButton);
  await waitFor(() => {
    const displayNameInput = screen.getByTestId("firstnameDisplay");
    const displaySurnameInput = screen.getByTestId("lastnameDisplay");
    const displayEmailInput = screen.getByTestId("emailDisplay");
    expect(displayNameInput).toHaveTextContent("Yaren");
    expect(displaySurnameInput).toHaveTextContent("Mert");
    expect(displayEmailInput).toHaveTextContent("yarenmert@gmail.com");
  });
});
