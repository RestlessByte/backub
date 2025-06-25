export interface IInterfaceByteMindAIHubUsers {
  id: number;
  user_id?: number;
  username?: string;
  name: string;
  speak: boolean;
  ai_model: string;
  trigger: boolean;
  info: string;
  email?: string;
  trigger_email: boolean;
  trigger_addinfo: boolean;
  trigger_addname: boolean;
  rub: number;
  premium_ai: boolean;
  trigger_ai: boolean;
  ssh_id: number;
  trigger_ssh_ip: boolean;
  trigger_ssh_name: boolean;
  trigger_ssh_port: boolean;
  mute: number
  trigger_ssh_password: boolean;
  trigger_ssh_auth_key: boolean;
  lenght_chats_save: number;
  lenght_chats_nosave: number;
}

export interface IInterfaceByteMindAIHubModels {
  id: number;
  title: string;
  link: string;
  url_api: string;
  api_key: string;
  premium: boolean;
  max_tokens: number;
  description: string;
  rub: string;
  price: number;
  blocked: boolean;
  rows?: any[]
}

export interface IInterfaceByteMindAIHubPayments {
  id: number;
  user_id: number;
  payment_id: string;
  amount: number;
  status: string;
  price: number;
  type: string;
}

