import os
import re


def fix_typescript_files(directory):
    """
    Добавляет export {}; в конец файлов TypeScript, которые не имеют экспортов или импортов
    """
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.ts', '.tsx')) and not file.endswith('.d.ts'):
                file_path = os.path.join(root, file)

                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Проверяем, есть ли уже импорт или экспорт
                has_imports = re.search(r'(import|export)\s+', content) is not None

                # Если нет импортов или экспортов, добавляем пустой экспорт
                if not has_imports:
                    print(f"Исправление файла: {file_path}")

                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                        # Добавляем строку, только если контент не пустой или не заканчивается новой строкой
                        if content and not content.endswith('\n'):
                            f.write('\n')
                        f.write('\nexport {};\n')


if __name__ == "__main__":
    # Путь к директории src фронтенда
    src_directory = os.path.join("techtrack", "frontend", "src")

    if os.path.exists(src_directory):
        print(f"Исправление файлов TypeScript в {src_directory}...")
        fix_typescript_files(src_directory)
        print("Готово!")
    else:
        print(f"Директория {src_directory} не найдена!")