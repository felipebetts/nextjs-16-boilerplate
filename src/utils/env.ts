// use este arquivo para exportar as envs com tratamento de erro //

const requireEnv = (name: string, optional: boolean = false): string => {
  const value = process.env[name]
  if (!value && !optional) {
    throw new Error(`Missing environment variable: ${name}`)
  }
  return value as string
}

// exemplo //
// export const MINHA_ENV = requireEnv('NEXT_PUBLIC_MINHA_ENV')