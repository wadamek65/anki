import mongoengine


class Word(mongoengine.EmbeddedDocument):
    original_language = mongoengine.StringField(db_field='originalLanguage')
    learning_language = mongoengine.StringField(db_field='learningLanguage')
    original_translations = mongoengine.ListField(mongoengine.StringField(), db_field='originalTranslations')
    learning_translation = mongoengine.StringField(db_field='learningTranslation')
    note = mongoengine.StringField()


class Vocabulary(mongoengine.Document):
    owner = mongoengine.StringField(required=True)
    words = mongoengine.EmbeddedDocumentListField(Word)
