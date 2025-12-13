const { rawKey, hash } = generateApiKey();

await supabase
  .from("api_keys")
  .insert({
    user_id,
    project_id,
    name: "Production Key",
    hashed_key: hash,
    active: true,
  });

// Return rawKey ONCE
return { apiKey: rawKey };

