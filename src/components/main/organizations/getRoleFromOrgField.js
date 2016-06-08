export default (organization, fieldName) => {
  const roleFromField = {
    esWriters: `${organization.Name} es`,
    lrWriters: `${organization.Name} lr`,
    orgAdmins: `${organization.Name} org`
  }
  return roleFromField[fieldName]
}
