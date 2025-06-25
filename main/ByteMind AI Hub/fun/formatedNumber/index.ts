export const FormatNumber = (number: number): string => {
  if (number === 0) return "0";
  if (number < 1000) return number.toString();

  // Вспомогательная функция для выбора корректной формы единицы измерения
  // forms: [форма для числа 1, форма для чисел 2-4, форма для чисел 5 и больше]
  // Если число дробное, всегда используем форму для дробных чисел (обычно в родительном падеже)
  const getUnitForm = (value: number, forms: [string, string, string]): string => {
    if (value % 1 !== 0) {
      return forms[1];
    }
    const intVal = Math.floor(value);
    const mod100 = intVal % 100;
    if (mod100 >= 11 && mod100 <= 14) return forms[2];
    const mod10 = intVal % 10;
    if (mod10 === 1) return forms[0];
    if (mod10 >= 2 && mod10 <= 4) return forms[1];
    return forms[2];
  };

  // Определяем единицы для форматирования: 1e3 — тысяча, 1e6 — миллион, 1e9 — миллиард и так далее.
  const units = [
    { value: 1e18, forms: ["квинтиллион", "квинтиллиона", "квинтиллионов"] },
    { value: 1e15, forms: ["квадриллион", "квадриллиона", "квадриллионов"] },
    { value: 1e12, forms: ["триллион", "триллиона", "триллионов"] },
    { value: 1e9, forms: ["миллиард", "миллиарда", "миллиардов"] },
    { value: 1e6, forms: ["миллион", "миллиона", "миллионов"] },
    { value: 1e3, forms: ["тысяча", "тысячи", "тысяч"] }
  ];

  for (const unit of units) {
    if (number >= unit.value) {
      const value = number / unit.value;
      // Если число целое – без дробей, иначе – с одним знаком после запятой.
      const formattedValue = value % 1 === 0 ? value.toFixed(0) : value.toFixed(1);
      return `${formattedValue} ${getUnitForm(value, unit.forms)}`;
    }
  }

  return ` ${number}`
};