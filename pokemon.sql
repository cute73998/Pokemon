--
-- PostgreSQL database dump
--

\restrict TO5Na57lph1qa7Sk5BmbL6W9RaEVoYDlB4uSAFSS5TMnjnhFdvuzFwpHS5rqoxN

-- Dumped from database version 16.11
-- Dumped by pg_dump version 18.0

-- Started on 2025-12-14 11:30:39

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16384)
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
-- TOC entry 4825 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16448)
-- Name: catch_cooldown; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.catch_cooldown (
    user_id integer NOT NULL,
    next_catch timestamp with time zone NOT NULL
);


ALTER TABLE public.catch_cooldown OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16418)
-- Name: pokemons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pokemons (
    id integer NOT NULL,
    name text NOT NULL,
    spawn_rate numeric NOT NULL,
    catch_rate numeric DEFAULT 0.5,
    created_at timestamp with time zone DEFAULT now(),
    avatar character varying(255),
    level integer,
    atack integer,
    defend integer,
    describe text
);


ALTER TABLE public.pokemons OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16417)
-- Name: pokemons_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pokemons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pokemons_id_seq OWNER TO postgres;

--
-- TOC entry 4826 (class 0 OID 0)
-- Dependencies: 218
-- Name: pokemons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pokemons_id_seq OWNED BY public.pokemons.id;


--
-- TOC entry 221 (class 1259 OID 16429)
-- Name: user_pokemons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_pokemons (
    id integer NOT NULL,
    user_id integer NOT NULL,
    pokemon_id integer NOT NULL,
    nickname text,
    caugth_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.user_pokemons OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16428)
-- Name: user_pokemons_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_pokemons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_pokemons_id_seq OWNER TO postgres;

--
-- TOC entry 4827 (class 0 OID 0)
-- Dependencies: 220
-- Name: user_pokemons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_pokemons_id_seq OWNED BY public.user_pokemons.id;


--
-- TOC entry 217 (class 1259 OID 16406)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    name text,
    password character varying(255),
    created_at timestamp with time zone DEFAULT now(),
    level integer,
    exp bigint,
    elo integer,
    base_atack integer,
    base_defend integer,
    last_random_time bigint DEFAULT 0,
    last_poke_name character varying(255),
    last_poke_level integer,
    last_poke_catch_rate integer,
    last_poke_describe text,
    last_poke_atack integer,
    last_poke_defend integer,
    last_poke_avatar character varying(500),
    last_poke_id bigint,
    avatar character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16405)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4828 (class 0 OID 0)
-- Dependencies: 216
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4652 (class 2604 OID 16421)
-- Name: pokemons id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pokemons ALTER COLUMN id SET DEFAULT nextval('public.pokemons_id_seq'::regclass);


--
-- TOC entry 4655 (class 2604 OID 16432)
-- Name: user_pokemons id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_pokemons ALTER COLUMN id SET DEFAULT nextval('public.user_pokemons_id_seq'::regclass);


--
-- TOC entry 4649 (class 2604 OID 16409)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4819 (class 0 OID 16448)
-- Dependencies: 222
-- Data for Name: catch_cooldown; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.catch_cooldown (user_id, next_catch) FROM stdin;
\.


--
-- TOC entry 4816 (class 0 OID 16418)
-- Dependencies: 219
-- Data for Name: pokemons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pokemons (id, name, spawn_rate, catch_rate, created_at, avatar, level, atack, defend, describe) FROM stdin;
3	Squirtle	0.10	0.70	2025-12-10 22:36:06.92694+07	/images/squirtle.png	9	48	65	Pokemon r—a nu?c.
2	Charmander	0.05	0.60	2025-12-10 22:35:24.708453+07	/images/charmander.jpg	12	60	50	Charmander is a fire lizard Pok‚mon. It has a fire on the tip of its tail, which indicates its health and mood. It is a lizard Pok‚mon known for being a Fire-type.
1	Pikachu	0.15	0.75	2025-12-10 22:33:50.838231+07	/images/pikachu.jpg	10	55	40	Pikachu is a small, yellow rodent-like Pok‚mon. It is recognizable by its long, pointed ears, red cheek pouches that store electricity, and a lightning bolt-shaped tail.
4	Bulbasaur	255	45	2025-12-11 11:01:33.588975+07	/images/bulbasaur.png	15	49	49	Bulbasaur is a grass/poison type Pokemon. It carries a large bulb on its back from birth.
5	Ivysaur	120	45	2025-12-11 11:01:33.588975+07	/images/ivysaur.png	24	62	63	When the bulb on its back grows large, it appears to lose the ability to stand on its hind legs.
6	Venusaur	45	45	2025-12-11 11:01:33.588975+07	/images/venusaur.png	36	82	83	The flower on its back is said to take on vivid colors if it gets plenty of nutrition and sunlight.
7	Weedle	255	255	2025-12-11 11:01:33.588975+07	/images/weedle.png	10	30	35	Weedle is a bug/poison type Pokemon. It is often found in forests and tall grasses.
8	Pidgey	255	255	2025-12-11 11:01:33.588975+07	/images/pidgey.png	10	45	40	Pidgey is a tiny flying bird Pokemon. It is common and found everywhere.
9	Rattata	255	255	2025-12-11 11:01:33.588975+07	/images/rattata.png	8	56	35	Rattata is a normal type rodent Pokemon. It is a common sight in many regions.
10	Ekans	255	255	2025-12-11 11:01:33.588975+07	/images/ekans.png	12	60	44	Ekans is a poison type snake Pokemon. It slithers silently through grass, looking for prey.
11	Jigglypuff	255	170	2025-12-11 11:01:33.588975+07	/images/jigglypuff.png	18	45	20	Jigglypuff has a charming song that can put its foes to sleep.
12	Zubat	255	255	2025-12-11 11:01:33.588975+07	/images/zubat.png	10	45	35	Zubat is a common cave dwelling pokemon. It uses sound waves to navigate in the dark.
13	Magikarp	255	255	2025-12-11 11:01:33.588975+07	/images/magikarp.png	5	10	55	Magikarp is a useless water type Pokemon. It is known for its ability to splash around.
14	Dratini	10	45	2025-12-11 11:01:33.588975+07	/images/dratini.png	30	64	45	Dratini is a rare dragon type Pokemon. It evolves into Dragonair.
15	Eevee	10	45	2025-12-11 11:01:33.588975+07	/images/eevee.png	25	55	50	Eevee is a unique normal type Pokemon that can evolve into many different forms.
16	Snorlax	3	25	2025-12-11 11:01:33.588975+07	/images/snorlax.png	35	110	65	Snorlax is a very rare and lazy Pokemon. It is known for its immense size and appetite.
17	Lapras	5	45	2025-12-11 11:01:33.588975+07	/images/lapras.png	40	85	80	Lapras is a gentle water/ice Pokemon often used for crossing seas.
18	Mewtwo	1	3	2025-12-11 11:01:33.588975+07	/images/mewtwo.png	70	110	90	Mewtwo is an extremely rare and powerful legendary psychic Pokemon.
19	Zapdos	1	3	2025-12-11 11:01:33.588975+07	/images/zapdos.png	60	90	85	Zapdos is a rare legendary electric/flying bird Pokemon.
20	Articuno	1	3	2025-12-11 11:01:33.588975+07	/images/articuno.png	60	85	100	Articuno is a rare legendary ice/flying bird Pokemon.
21	Moltres	1	3	2025-12-11 11:01:33.588975+07	/images/moltres.png	60	100	90	Moltres is a rare legendary fire/flying bird Pokemon.
22	Gyarados	45	45	2025-12-11 11:01:33.588975+07	/images/gyarados.png	20	125	79	Gyarados is a fierce water/flying Pokemon known for its destructive power.
23	Onix	120	45	2025-12-11 11:01:33.588975+07	/images/onix.png	25	45	160	Onix is a rock snake Pokemon that bores through the ground at high speed.
24	Mew	0.01	0.05	2025-12-11 13:18:31.47897+07	/images/mew.png	100	100	100	The rarest mythical Pok‚mon, capable of learning every move.
25	Celebi	0.01	0.10	2025-12-11 13:18:31.47897+07	/images/celebi.png	80	90	90	A time-traveling Pok‚mon, known as the voice of the forest.
26	Jirachi	0.005	0.03	2025-12-11 13:18:31.47897+07	/images/jirachi.png	90	110	110	The Wish Pok‚mon, said to wake for only one week every thousand years.
27	Deoxys	0.005	0.08	2025-12-11 13:18:31.47897+07	/images/deoxys.png	95	150	70	A Pok‚mon that transforms its form, having come from outer space.
28	Zapdos	0.05	0.15	2025-12-11 13:18:31.47897+07	/images/zapdos.png	70	125	85	A Legendary Electric/Flying Pok‚mon. It causes thunderous storms.
29	Moltres	0.05	0.15	2025-12-11 13:18:31.47897+07	/images/moltres.png	70	100	90	A Legendary Fire/Flying Pok‚mon. It bursts into flames when battling.
30	Articuno	0.05	0.15	2025-12-11 13:18:31.47897+07	/images/articuno.png	70	85	100	A Legendary Ice/Flying Pok‚mon. Its wings chill the air around it.
31	Snorlax	0.5	0.50	2025-12-11 13:18:31.47897+07	/images/snorlax.png	35	110	65	A large Pok‚mon that is constantly sleeping. It only wakes up to eat.
32	Gyarados	0.2	0.30	2025-12-11 13:18:31.47897+07	/images/gyarados.png	40	125	79	A fierce Water/Flying Pok‚mon, evolved from a Magikarp.
33	Eevee	1.0	0.90	2025-12-11 13:18:31.47897+07	/images/eevee.png	5	55	50	A small Pok‚mon with the ability to evolve into multiple different forms.
34	Dratini	0.1	0.60	2025-12-11 13:18:31.47897+07	/images/dratini.png	10	64	45	A rare Dragon Pok‚mon, said to be able to control the weather.
35	Mewtwo	0.001	0.01	2025-12-11 13:18:31.47897+07	/images/mewtwo.png	100	150	90	A man-made Legendary Pok‚mon with enormous psychic power.
36	Ho-Oh	0.005	0.05	2025-12-11 13:18:31.47897+07	/images/hooh.png	85	130	90	A Legendary Fire/Flying Pok‚mon, said to bring eternal happiness.
37	Lugia	0.005	0.05	2025-12-11 13:18:31.47897+07	/images/lugia.png	85	90	130	A Legendary Psychic/Flying Pok‚mon, known as the Guardian of the Seas.
38	Metapod	255	255	2025-12-11 13:18:31.47897+07	/images/metapod.png	10	20	55	Enveloped in a hard shell, waiting for the evolution process.
39	Jynx	1.0	0.50	2025-12-11 13:18:31.47897+07	/images/jynx.png	25	50	35	An Ice/Psychic Pok‚mon, it moves as if it were dancing.
40	Machop	255	255	2025-12-11 13:18:31.47897+07	/images/machop.png	15	80	50	A Fighting-type Pok‚mon, always striving to become stronger.
41	Zubat	255	255	2025-12-11 13:18:31.47897+07	/images/zubat.png	8	45	35	A Poison/Flying Pok‚mon, it has no eyes and uses ultrasonic waves.
42	Geodude	255	255	2025-12-11 13:18:31.47897+07	/images/geodude.png	10	80	100	A Rock/Ground Pok‚mon, often found rolling down mountain paths.
43	Gastly	0.8	0.65	2025-12-11 13:18:31.47897+07	/images/gastly.png	12	60	30	A Ghost/Poison Pok‚mon, made up of poisonous gas.
\.


--
-- TOC entry 4818 (class 0 OID 16429)
-- Dependencies: 221
-- Data for Name: user_pokemons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_pokemons (id, user_id, pokemon_id, nickname, caugth_at) FROM stdin;
18	2	38	nickname	2025-12-13 21:00:06.023271+07
19	3	40	nickname	2025-12-13 21:02:16.498916+07
20	1	11	nickname	2025-12-13 21:04:28.897998+07
21	2	41	nickname	2025-12-13 21:07:50.397506+07
22	3	7	nickname	2025-12-13 21:09:56.892052+07
23	1	10	nickname	2025-12-13 21:10:38.950333+07
24	2	8	nickname	2025-12-13 21:13:04.701271+07
25	3	9	nickname	2025-12-13 21:14:57.646586+07
26	1	13	nickname	2025-12-13 21:24:26.5958+07
27	2	8	nickname	2025-12-13 21:25:53.104124+07
28	3	10	nickname	2025-12-13 21:26:50.390425+07
29	1	11	nickname	2025-12-14 08:41:07.471881+07
30	1	38	nickname	2025-12-14 08:59:47.478137+07
\.


--
-- TOC entry 4814 (class 0 OID 16406)
-- Dependencies: 217
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, name, password, created_at, level, exp, elo, base_atack, base_defend, last_random_time, last_poke_name, last_poke_level, last_poke_catch_rate, last_poke_describe, last_poke_atack, last_poke_defend, last_poke_avatar, last_poke_id, avatar) FROM stdin;
3	user3	Cao_thu_1	cuong25092005@	2025-12-12 23:11:32.606973+07	1	0	1000	10	10	1765674849415	Geodude	10	255	A Rock/Ground Pok‚mon, often found rolling down mountain paths.	80	100	/images/geodude.png	42	\N
2	user2	Misty Water	pikachu123	2025-12-10 22:31:36.248426+07	1	0	0	10	10	1765683257924	Rattata	8	255	Rattata is a normal type rodent Pokemon. It is a common sight in many regions.	56	35	/images/rattata.png	9	\N
1	user1	Ash Ketchum	pikachu123	2025-12-10 22:31:36.248426+07	1	0	0	10	10	1765684358390	Rattata	8	255	Rattata is a normal type rodent Pokemon. It is a common sight in many regions.	56	35	/images/rattata.png	9	/images/avatars/user-1-1765683562366.png
\.


--
-- TOC entry 4829 (class 0 OID 0)
-- Dependencies: 218
-- Name: pokemons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pokemons_id_seq', 43, true);


--
-- TOC entry 4830 (class 0 OID 0)
-- Dependencies: 220
-- Name: user_pokemons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_pokemons_id_seq', 30, true);


--
-- TOC entry 4831 (class 0 OID 0)
-- Dependencies: 216
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- TOC entry 4666 (class 2606 OID 16452)
-- Name: catch_cooldown catch_cooldown_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catch_cooldown
    ADD CONSTRAINT catch_cooldown_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4662 (class 2606 OID 16427)
-- Name: pokemons pokemons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pokemons
    ADD CONSTRAINT pokemons_pkey PRIMARY KEY (id);


--
-- TOC entry 4664 (class 2606 OID 16437)
-- Name: user_pokemons user_pokemons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_pokemons
    ADD CONSTRAINT user_pokemons_pkey PRIMARY KEY (id);


--
-- TOC entry 4658 (class 2606 OID 16414)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4660 (class 2606 OID 16416)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4669 (class 2606 OID 16453)
-- Name: catch_cooldown catch_cooldown_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catch_cooldown
    ADD CONSTRAINT catch_cooldown_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4667 (class 2606 OID 16443)
-- Name: user_pokemons user_pokemons_pokemon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_pokemons
    ADD CONSTRAINT user_pokemons_pokemon_id_fkey FOREIGN KEY (pokemon_id) REFERENCES public.pokemons(id) ON DELETE RESTRICT;


--
-- TOC entry 4668 (class 2606 OID 16438)
-- Name: user_pokemons user_pokemons_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_pokemons
    ADD CONSTRAINT user_pokemons_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2025-12-14 11:30:40

--
-- PostgreSQL database dump complete
--

\unrestrict TO5Na57lph1qa7Sk5BmbL6W9RaEVoYDlB4uSAFSS5TMnjnhFdvuzFwpHS5rqoxN

