export const formatRub = (rub: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(rub);

export const pluralizeRu = (n: number, forms: [string, string, string]) => {
  const abs = Math.abs(n) % 100;
  const n1 = abs % 10;
  if (abs > 10 && abs < 20) return forms[2];
  if (n1 > 1 && n1 < 5) return forms[1];
  if (n1 === 1) return forms[0];
  return forms[2];
};

// Достаёт «национальные» цифры (без кода страны), максимум 10 штук.
// Ведущая 7 или 8 трактуется как код страны и отбрасывается.
export const ruPhoneNational = (input: string): string => {
  let d = input.replace(/\D/g, "");
  if (d.length > 0 && (d[0] === "7" || d[0] === "8")) d = d.slice(1);
  return d.slice(0, 10);
};

// Маска российского номера: «+7 (XXX) XXX XX XX».
// Пустой ввод → пустая строка (чтобы показывался placeholder).
// Логика повторяет ru_phone_formatter.
export const formatRuPhone = (input: string): string => {
  const digits = ruPhoneNational(input);
  if (digits.length === 0) return "";
  let out = "+7 (" + digits.slice(0, 3);
  if (digits.length < 3) return out;
  out += ")";
  if (digits.length === 3) return out;
  out += " " + digits.slice(3, 6);
  if (digits.length <= 6) return out;
  out += " " + digits.slice(6, 8);
  if (digits.length <= 8) return out;
  out += " " + digits.slice(8, 10);
  return out;
};

export const ruPhoneDigits = (input: string): string => {
  let digits = input.replace(/\D/g, "");
  if (digits.length > 0 && (digits[0] === "7" || digits[0] === "8")) {
    digits = "7" + digits.slice(1);
  } else if (digits.length > 0) {
    digits = "7" + digits;
  }
  return digits;
};
