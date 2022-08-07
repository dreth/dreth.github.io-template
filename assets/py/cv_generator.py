# importing libs
from dataclasses import replace
import json
import re
import os
from time import sleep

# %%
# emoji patterns remove emojis
# https://stackoverflow.com/a/49146722/330558
def remove_emoji(string):
    emoji_pattern = re.compile("["
                               u"\U0001F600-\U0001F64F"  # emoticons
                               u"\U0001F300-\U0001F5FF"  # symbols & pictographs
                               u"\U0001F680-\U0001F6FF"  # transport & map symbols
                               u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
                               u"\U00002500-\U00002BEF"  # chinese char
                               u"\U00002702-\U000027B0"
                               u"\U00002702-\U000027B0"
                               u"\U000024C2-\U0001F251"
                               u"\U0001f926-\U0001f937"
                               u"\U00010000-\U0010ffff"
                               u"\u2640-\u2642"
                               u"\u2600-\u2B55"
                               u"\u200d"
                               u"\u23cf"
                               u"\u23e9"
                               u"\u231a"
                               u"\ufe0f"  # dingbats
                               u"\u3030"
                               "]+\s", flags=re.UNICODE)
    return emoji_pattern.sub(r'', string)

# remove list items in detail sections
def remove_lists(string):
    item_pattern = re.compile("-\s")
    return item_pattern.sub(r'', string)

# escape som characters
def escape_chars(string):
    chars = ['&']
    # replace stuff
    for char in chars:
        string = string.replace(char, f'\\{char}')
    return string

# %%
# CV data
cv_data = {}

# basic links
cv_data['basic_links'] = {
    "website":{
        "link":"https://yoursite.com",
        "name":"yoursite.com"
    },
    "github":{
        "link":"https://github.com/your_github_user",
        "name":"@your_user"
    },
    "email":{
        "link":"mailto:daniel@yoursite.com",
        "name":"contact@yoursite.com"
    },
    "linkedin":{
        "link":"https://linkedin.com/in/your_linkedin_user",
        "name":"@your_user"
    }
}

# short description
with open('./data/languages.json', 'r') as f:
    cv_data['short_description'] = json.load(f)['content']['about_me_short']

# other cv data
with open('./data/cv.json', 'r') as f:
    full_cv_json = json.loads(remove_emoji(f.read()))
    cv_data['education'] = full_cv_json['education']
    cv_data['work'] = full_cv_json['work']
    cv_data['languages'] = full_cv_json['other']['languages']
    cv_data['skills'] = full_cv_json['other']['skills']

    # remove headings
    for section in ['education', 'work', 'languages', 'skills']:
        del cv_data[section]['heading']
    
    # remove dashes in detail section
    for lang, element_list in cv_data['work']['detail'].items():
        for i,item in enumerate(element_list):
            element_list[i] = remove_lists(item)

# %%
# skeleton
cv_skeleton = r"""
%------------------------
% Resume Template
% Author : Anubhav Singh
% Github : https://github.com/xprilion
% License : MIT
%------------------------

\documentclass[a4paper,20pt]{article}

\usepackage[inline]{enumitem}
\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[pdftex]{hyperref}
\usepackage{fancyhdr}

\pagestyle{fancy}
\fancyhf{} % clear all header and footer fields
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

% Adjust margins
\addtolength{\oddsidemargin}{-0.530in}
\addtolength{\evensidemargin}{-0.375in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-.45in}
\addtolength{\textheight}{1in}

\urlstyle{rm}

\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

% Sections formatting
\titleformat{\section}{
  \vspace{-10pt}\scshape\raggedright\large
}{}{0em}{}[\color{black}\titlerule \vspace{-6pt}]

%-------------------------
% Custom commands
\newcommand{\resumeItem}[2]{
  \item\small{
    \textbf{#1}{: #2 \vspace{-2pt}}
  }
}

\newcommand{\resumeItemWithoutTitle}[1]{
  \item\small{
    {\vspace{-2pt}}
  }
}

\newcommand{\resumeSubheading}[4]{
  \vspace{-1pt}\item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \textbf{#1} & #2 \\
      \textit{#3} & \textit{#4} \\
    \end{tabular*}\vspace{-5pt}
}


\newcommand{\resumeSubItem}[2]{\resumeItem{#1}{#2}\vspace{-3pt}}

\renewcommand{\labelitemii}{$\circ$}

\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=*]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}

%-----------------------------
%%%%%%  CV STARTS HERE  %%%%%%

\begin{document}

%----------HEADING-----------------
\begin{tabular*}{\textwidth}{l@{\extracolsep{\fill}}r}
  \textbf{{\LARGE Your name}} & Email: {\color{blue}\href{mailto:}{*email:name*}}\\
  Website: {\color{blue}\href{*website:link*}{*website:name*}} & Github: ~~~{\color{blue}\href{*github:link*}{*github:name*}}
\end{tabular*}

%----------SECTIONS TO ITERATE ON-----------------
*iteration_items*

%-----------PROJECTS-----------------
\vspace{-10pt}
\section{*projects*}
\textbf{View all my projects on \href{https://yoursite.com/projects}{my website}}

\end{document}
"""

# %%
# blocks
cv_blocks = {
### SECTION NAMES PER LANG
    'section_names': {
        'en': {
            'education':'Education',
            'languages':'Languages',
            'skills':'Skills Summary',
            'work':'Work experience',
            'projects':'Projects'
        },
        'es': {
            'education':'Educación',
            'languages':'Idiomas',
            'skills':'Habilidades',
            'work':'Experiencia de trabajo',
            'projects':'Proyectos'
        }
    },

### GENERAL SEPARATORS
    'separator': {
        'education':
            r"""
\vspace{-2pt}""",
        'work':
            r"""
\vspace{-4.2pt}""",
        'languages':
            r"""
\vspace{-2pt}"""
    },

### GENERAL INDENTERS
    'indenter': {
        'en':{
            'skills':{
                'Languages':'~~~~~~',
                'Frameworks':'~~~~',
                'Tools':'~~~~~~~~~~~~~~',
                'Platforms':'~~~~~~~',
                'Other':'~~~~~~~~~~~~~'
            }
        },
        'es':{
            'skills':{
                'Languages':'~~~~~~~',
                'Frameworks':'~~~~',
                'Tools':'~~~~~~~',
                'Platforms':'~~~~',
                'Other':'~~~~~~~~~~~~~~'
            }
        }
    },

### EDUCATION SECTION
    'education': {
        'title':
            r"""
%-----------EDUCATION-----------------
\vspace{-4pt}
\section{*education*}
\resumeSubHeadingListStart""",
        'iterative_block':
            r"""
  \resumeSubheading
    {*institution*}{*location*}
    {*title*}{*dates*}""",
        'closing_tag':
            r"""
\resumeSubHeadingListEnd"""
    },

### SKILLS SECTION
    'skills': {
        'title':
            r"""
%-----------SKILLS-----------------
\vspace{-7pt}
\section{*skills*}
  \resumeSubHeadingListStart
            """,
        'iterative_block':
            r"""
\vspace{-2pt}
\resumeSubItem{*section*}{*indenter**skill_list*}""",
        'closing_tag':
            r"""
\resumeSubHeadingListEnd"""
    },

### WORK SECTION
    'work': {
        'title':
            r"""
%-----------WORK-----------------
\vspace{-12pt}
\section{*work*}
  \resumeSubHeadingListStart""",
        'iterative_block':
            r"""
  \resumeSubheading{*institution*}{*location*}
    {*title* (*schedule*)}{*dates*}""",
        'itemize_start':
            r"""
\begin{itemize} \itemsep-0.24em""",
        'itemize_item':
            r"""
  \item *item*""",
        'itemize_end':
            r"""
\end{itemize}""",
        'closing_tag':
            r"""
\resumeSubHeadingListEnd"""
    },

### SKILLS SECTION
    'languages': {
        'title':
            r"""
%-----------LANGUAGES-----------------
\vspace{-10pt}
\section{*languages*}
  \begin{center}
  \begin{itemize*}""",
        'iterative_block':
            r"""
  \item \textbf{*level*} *language_list*""",
        'closing_tag':
            r"""
\end{itemize*}
\end{center}"""
    },
}

# %%
# create the CV tex document
def fill_cv(cv_skeleton, l="en"):
    # adding links to header
    for section, detail in cv_data['basic_links'].items():
        for subsection, value in detail.items():
            cv_skeleton = cv_skeleton.replace(f"*{section}:{subsection}*", value)
    
    # iteration items
    # generate iteration items string
    iteration_items = ''

    # iterating over standardized sections
    standardized_sections = ['education', 'skills', 'languages', 'work']
    for section in standardized_sections:

        # add to the iteration items string
        iteration_items += f"""


            {cv_blocks[section]['title']}
        """

        # items in education
        if section == 'education':

            # add iterative items from specified section
            for i,entry in enumerate(cv_data[section]['list'][l]):

                    # replace items in entry and append to iteration items
                    it_item = cv_blocks[section]['iterative_block']
                    for key, value in entry.items():
                        it_item = it_item.replace(f"*{key}*", value)
                    
                    # add education section
                    iteration_items += it_item

                    # add separator
                    if i < (len(cv_data[section]['list'][l])-1):
                        iteration_items += cv_blocks['separator'][section]
            
        # items in skills section
        if section == 'skills':

            # done skills section
            done_skills_sections = set()
            skills_section = ''

            # replace items in entry and append to iteration items
            for key, value in cv_data[section]['list'][l]['noLevel'].items():

                # section name
                section_name = re.sub('\d','', cv_data[section]["skills_categories"][key][l]).capitalize()
                section_name_std = re.sub('\d','', key).capitalize()

                # replace special tags
                if section_name_std not in done_skills_sections:
                    skill_block = cv_blocks[section]['iterative_block']

                    # tags and replacements
                    tags = ['*section*', '*indenter*', '*skill_list*']
                    replacements = [
                        section_name, 
                        cv_blocks['indenter'][l][section][section_name_std],
                        value
                    ]
                    
                    # make replacements
                    for tag, replacement in zip(tags, replacements):
                        skill_block = skill_block.replace(tag, replacement)

                    # add element to skills section string
                    skills_section += skill_block
                else:
                    # subtract previously added element 
                    skills_section = skills_section[0:len(skills_section)-len(skill_block)]

                    # additional space in spanish
                    extra_space = {
                        "en":'',
                        "es":'~'
                    }[l]

                    # adding the additional elements to the section
                    skill_block = skill_block[0:-1]
                    skill_block += f'\\\\~~~~~~~~~~~~~~~~~~~~~~~~{extra_space}{value}}}'

                    # add with the added newline
                    skills_section += skill_block
            
                # append to done skills sections
                done_skills_sections.add(section_name_std)
            
            # add skills section
            iteration_items += skills_section

        # items in languages section
        if section == 'languages':

            # add languages and levels
            for i, (level, level_name) in enumerate(cv_data[section]['level'][l].items()):

                # add replace cv block tags
                it_item = cv_blocks[section]['iterative_block'].replace(f"*level*", level_name)

                # iterate over languages in section
                it_item = it_item.replace(
                    '*language_list*',
                    ''.join([f'{x}, ' for x in cv_data[section]['list'][l][level]])[:-2] + '.'
                )

                # add language level
                iteration_items += it_item

        # items in work section
        if section == 'work':

            # add iterative items from specified section
            for i, entry in enumerate(cv_data[section]['list'][l]):

                    # replace items in entry and append to iteration items
                    it_item = cv_blocks[section]['iterative_block']
                    for key, value in entry.items():
                        it_item = it_item.replace(f"*{key}*", value)
                        
                    # add list of items for work experience detail
                    it_item += cv_blocks[section]['itemize_start']
                    
                    # iterate over details
                    for detail_item in cv_data[section]['detail'][l][i].split('<br>'):
                        it_item += cv_blocks[section]['itemize_item'].replace('*item*',detail_item)
                    
                    # add itemize end
                    it_item += cv_blocks[section]['itemize_end']
                
                    # add separator
                    if (i < (len(cv_data[section]['list'][l])-1)):
                        it_item += cv_blocks['separator'][section]
                
                    # add language level
                    iteration_items += escape_chars(it_item)
                 
        # add closing tag
        iteration_items += cv_blocks[section]['closing_tag']

    # add iteration items to cv skeleton
    cv_skeleton = cv_skeleton.replace('*iteration_items*', iteration_items)
    cv_skeleton = cv_skeleton.replace(r"""
\begin{itemize} \itemsep-0.24em
  \item 
\end{itemize}""","")

    # add section name
    for section in standardized_sections + ['projects']:
        cv_skeleton = cv_skeleton.replace(f'*{section}*', cv_blocks['section_names'][l][section])

    # create a tex file for cv
    with open(f'./assets/py/Your_name_CV_{l}.tex','w') as f:
        f.write(cv_skeleton)
    
# %%
# run function and save file corresponding to language
fill_cv(cv_skeleton=cv_skeleton, l="en")
fill_cv(cv_skeleton=cv_skeleton, l="es")

# force compile latex
os.system('cd assets/py && latexmk')

# clean up
sleep(1.5)
for filetype in ['fls', 'log', 'fdb_latexmk', 'aux', 'gz', 'out']:
    os.system(f'cd assets/py && rm *.{filetype}')
