// utils/nationalityMapper.js
export const mapNationalityToCountry = (nationality) => {
  const nationalityToCountryMap = {
    Kenyan: "Kenya",
    Ugandan: "Uganda",
    Tanzanian: "Tanzania",
    Rwandan: "Rwanda",
    Burundian: "Burundi",
    SouthSudanese: "South Sudan",
    Congolese: "Congo",
    Somali: "Somalia",
  };

  return nationalityToCountryMap[nationality] || nationality;
};
