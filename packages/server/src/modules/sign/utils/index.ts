export class NumberEncryptor {
  private static distance = 1055345431234536
  private static characters = 'jKlMn56Q9Op3zA8fGhIbCd014rStUvWxY72E' // Further updated character set
  private static base = NumberEncryptor.characters.length

  public static encrypt(number: number): string {
    number = this.distance + number
    let result = ''
    while (number > 0) {
      result = NumberEncryptor.characters.charAt(number % NumberEncryptor.base) + result
      number = Math.floor(number / NumberEncryptor.base)
    }
    while (result.length < 10) {
      result = NumberEncryptor.characters.charAt(0) + result // Padding with the first character
    }
    return result
  }

  public static decrypt(code: string): number {
    let result = 0
    for (let i = 0; i < code.length; i++) {
      result = result * NumberEncryptor.base + NumberEncryptor.characters.indexOf(code.charAt(i))
    }
    return result - this.distance
  }
}
