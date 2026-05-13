/**
 * @summary Represents a ColdTrack account user.
 * @author Codex Assistant
 */
export class User {
  /**
   * Creates a user instance.
   *
   * @param {object} user Raw user properties.
   */
  constructor(user = {}) {
    this.id = user.id ?? null;
    this.fullName = user.fullName ?? '';
    this.email = user.email ?? '';
    this.password = user.password ?? '';
    this.role = user.role ?? 'operator';
  }
}
