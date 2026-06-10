from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    """Базова схема: назовні camelCase, всередині snake_case.

    populate_by_name=True дозволяє приймати обидва варіанти на вхід;
    from_attributes=True дає валідацію прямо з ORM-обʼєктів.
    """

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )
